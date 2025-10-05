import { AttributeGPUType, BufferAttribute, BufferGeometry, FloatType, GeometryGroup, IntType } from "three";

type TypedArrayConstructor =
    | Float32ArrayConstructor
    | Int8ArrayConstructor
    | Int16ArrayConstructor
    | Int32ArrayConstructor
    | Uint8ArrayConstructor
    | Uint16ArrayConstructor
    | Uint32ArrayConstructor;

const Endianness = {
    LITTLE_ENDIAN: 0,
    BIG_ENDIAN: 1,
};

const IndicesType = {
    UNSIGNED_INT_16: 0,
    UNSIGNED_INT_32: 1,
};

const AttributeType = {
    FLOAT: 0,
    INT: 1,
};

const EncodingType = {
    SIGNED_FLOAT_32: 1,
    SIGNED_INT_8: 3,
    SIGNED_INT_16: 4,
    SIGNED_INT_32: 6,
    UNSIGNED_INT_8: 7,
    UNSIGNED_INT_16: 8,
    UNSIGNED_INT_32: 10,
};

const INDICES_TYPE_CONSTRUCTORS: Record<number, TypedArrayConstructor> = {
    [IndicesType.UNSIGNED_INT_16]: Uint16Array,
    [IndicesType.UNSIGNED_INT_32]: Uint32Array,
};

const ENCODING_TYPE_CONSTRUCTORS: Record<number, TypedArrayConstructor> = {
    [EncodingType.SIGNED_FLOAT_32]: Float32Array,
    [EncodingType.SIGNED_INT_8]: Int8Array,
    [EncodingType.SIGNED_INT_16]: Int16Array,
    [EncodingType.SIGNED_INT_32]: Int32Array,
    [EncodingType.UNSIGNED_INT_8]: Uint8Array,
    [EncodingType.UNSIGNED_INT_16]: Uint16Array,
    [EncodingType.UNSIGNED_INT_32]: Uint32Array,
};

const DATA_VIEW_GETTERS: Record<string, keyof DataView & `get${"Uint" | "Int" | "Float"}${"8" | "16" | "32" | "64"}`> =
    {
        Float32Array: "getFloat32",
        Float64Array: "getFloat64",
        Uint8Array: "getUint8",
        Uint16Array: "getUint16",
        Uint32Array: "getUint32",
        Int8Array: "getInt8",
        Int16Array: "getInt16",
        Int32Array: "getInt32",
    };

const ATTRIBUTETYPE_GPUTYPE_MAPPING: Record<number, AttributeGPUType> = {
    [AttributeType.FLOAT]: FloatType,
    [AttributeType.INT]: IntType,
};

export class PRBMParser {
    static parse(dataBuffer: ArrayBufferLike, offset: number = 0): BufferGeometry {
        if ((offset / 4) % 1 !== 0) throw new Error(`PRBM: offset should be a multiple of 4, but is ${offset}`);

        // bytes array
        const bytes = new Uint8Array(dataBuffer, offset);

        // read header
        const version = bytes[0];
        const flags = bytes[1];
        const indexed = !!((flags >> 7) & 0x01);
        const indicesType = (flags >> 6) & 0x01;
        const endianness = (flags >> 5) & 0x01;
        const attributesCount = flags & 0x1f;
        const valuesPerAttribute =
            endianness == Endianness.BIG_ENDIAN
                ? (bytes[2] << 16) + (bytes[3] << 8) + bytes[4]
                : (bytes[4] << 16) + (bytes[3] << 8) + bytes[2];
        const indicesCount =
            endianness == Endianness.BIG_ENDIAN
                ? (bytes[5] << 16) + (bytes[6] << 8) + bytes[7]
                : (bytes[7] << 16) + (bytes[6] << 8) + bytes[5];

        // check version
        if (version !== 1) throw new Error(`PRBM: Unsupported version: ${version}`);

        const geometry = new BufferGeometry();
        const reader = new ByteReader(bytes, 8);

        // read attributes
        for (let i = 0; i < attributesCount; i++) {
            const name = this.readString(reader);
            const flags = reader.read();

            const attributeType = (flags >> 7) & 0x01;
            const normalized = !!((flags >> 6) & 0x01);
            const cardinality = ((flags >> 4) & 0x03) + 1;
            const encodingType = flags & 0x0f;

            reader.skipPadding();
            const arrayConstructor = ENCODING_TYPE_CONSTRUCTORS[encodingType];
            const values = this.readArray(
                dataBuffer,
                arrayConstructor,
                reader.pos + offset,
                valuesPerAttribute * cardinality,
                endianness
            );
            reader.skip(valuesPerAttribute * cardinality * arrayConstructor.BYTES_PER_ELEMENT);

            const attribute = new BufferAttribute(values, cardinality, normalized);
            attribute.gpuType = ATTRIBUTETYPE_GPUTYPE_MAPPING[attributeType];

            geometry.setAttribute(name, attribute);
        }

        // read index
        if (indexed) {
            reader.skipPadding();
            const arrayConstructor = INDICES_TYPE_CONSTRUCTORS[indicesType];
            const values = this.readArray(dataBuffer, arrayConstructor, reader.pos + offset, indicesCount, endianness);
            reader.skip(indicesCount * arrayConstructor.BYTES_PER_ELEMENT);

            const attribute = new BufferAttribute(values, 1);

            geometry.setIndex(attribute);
        }

        // read groups
        reader.skipPadding();
        const groups: GeometryGroup[] = [];
        while (reader.hasMore()) {
            const next = this.read4ByteInt(reader, endianness);
            if (next === -1) break;
            groups.push({
                materialIndex: next,
                start: this.read4ByteInt(reader, endianness),
                count: this.read4ByteInt(reader, endianness),
            });
        }
        geometry.groups = groups;

        return geometry;
    }

    private static readString(reader: ByteReader): string {
        let result = "";
        while (reader.hasMore()) {
            const char = reader.read();
            if (char === 0) break;
            result += String.fromCharCode(char);
        }
        return result;
    }

    private static read4ByteInt(reader: ByteReader, endianness: number): number {
        if (endianness === Endianness.BIG_ENDIAN) {
            return (reader.read() << 24) | (reader.read() << 16) | (reader.read() << 8) | reader.read();
        } else {
            return reader.read() | (reader.read() << 8) | (reader.read() << 16) | (reader.read() << 24);
        }
    }

    private static readArray(
        dataBuffer: ArrayBufferLike,
        arrayConstructor: TypedArrayConstructor,
        position: number,
        length: number,
        endianness: number
    ) {
        if (endianness === getEndianness() || arrayConstructor.BYTES_PER_ELEMENT === 1) {
            // @ts-ignore (ts doesn't find overloaded constructor, see: https://github.com/microsoft/TypeScript/issues/14107)
            return new arrayConstructor(dataBuffer, position, length);
        }

        console.debug("PRWM file has opposite encoding, loading will be slow...");

        const dataView = new DataView(dataBuffer, position, length * arrayConstructor.BYTES_PER_ELEMENT);
        const getter = DATA_VIEW_GETTERS[arrayConstructor.name];
        const array = new arrayConstructor(length);
        for (let i = 0; i < length; i++) {
            array[i] = dataView[getter](
                i * arrayConstructor.BYTES_PER_ELEMENT,
                endianness === Endianness.LITTLE_ENDIAN
            );
        }

        return array;
    }
}

class ByteReader {
    bytes: Uint8Array;
    pos: number;

    constructor(bytes: Uint8Array, pos: number = 0) {
        this.bytes = bytes;
        this.pos = pos;
    }

    read(): number {
        return this.bytes[this.pos++];
    }

    skip(count: number = 1): void {
        this.pos += count;
    }

    skipPadding(): void {
        this.pos = Math.ceil(this.pos / 4) * 4;
    }

    hasMore(): boolean {
        return this.pos < this.bytes.length;
    }
}

let endianness: number | undefined = undefined;
function getEndianness() {
    if (endianness === undefined) {
        const buffer = new ArrayBuffer(2);
        const uint8Array = new Uint8Array(buffer);
        const uint16Array = new Uint16Array(buffer);
        uint8Array[0] = 0xaa;
        uint8Array[1] = 0xbb;
        endianness = uint16Array[0] === 0xaabb ? Endianness.BIG_ENDIAN : Endianness.LITTLE_ENDIAN;
    }

    return endianness;
}
