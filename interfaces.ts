export interface ArtistObject{
    id: number,
    name: string,
    genres: Array<string>,
    followers: number,
    img_src: string,
    spotify_url: string,
    popularity: number,
}

export interface RelatedArtist{
    id: number,
    name:string,
    img_src: string,
}
