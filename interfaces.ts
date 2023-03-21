export interface ArtistObject{
    id: string,
    name: string,
    genres: Array<string>,
    followers: number,
    img_src: string,
    spotify_url: string,
    popularity: number,
}

export interface ArtistReference{
    id: string,
    name:string,
    img_src?: string,
}

export interface TrackObject{
    id: string,
    name:string,
    album_name:string,
    album_id:number,
    img_src:string,
    artists: Array<ArtistReference>,
}