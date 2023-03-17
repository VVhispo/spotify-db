import React, {useState} from 'react'
import { AlbumItem } from './AlbumItem'

interface Props{
    albums: Array<any>,
}

export const Discography: React.FC<Props> = ({albums}) => {
    return(<>
        {albums.map(album=>{
            return <AlbumItem key={album.id} artist_name={album.artists[0].name} img_url={album.images[0].url} name={album.name} year={album.release_date} />
        })}
    </>)
}