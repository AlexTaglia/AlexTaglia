export interface Attribute {
    trait_type: string;
    value: string;
}

export interface Metadata {
    name?: string;
    description: string;
    image: string;
    animation_url?: string;
    attributes: Attribute[];
    external_url?:string;
    background_color?:string
}