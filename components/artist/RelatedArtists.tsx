import React, {useState} from 'react'
import styles from "@/styles/artist.module.css"
import { Track } from './Track'
import { ArtistItem } from './ArtistItem'

interface Props{
    relatedArtists: Array<any>
}

export const RelatedArtists: React.FC<Props> = ({relatedArtists}) => {
    return(<>
        <h3 className={styles.relatedArtistsHeader}>Related Artists</h3>
        {relatedArtists.map(artist => {
            return(
                <ArtistItem key={artist.id} name={artist.name} image_url={artist.images[0].url} height={64}/>
            )
        })}
    </>)
} 