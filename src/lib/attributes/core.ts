
export interface AttributeType {
  name: string
}

export interface AttributeMapValueType {
  ownerMap: string
  name: string
}

export interface AttributeMapType extends AttributeType {

}

export type AttributeTypeCheck<T extends AttributeType> = (t: AttributeType) => t is T

export type AttributeMapValueTypeCheck<T extends AttributeMapValueType> = (t: AttributeMapValueType) => t is T
