import React, {useState} from 'react'
import styles from "@/styles/artist.module.css"
import { Track } from './Track'
import { ArtistItem } from './ArtistItem'
import { RelatedArtist } from '@/interfaces'

interface Props{
    relatedArtists: Array<RelatedArtist>
}

export const RelatedArtists: React.FC<Props> = ({relatedArtists}) => {
    return(<>
        <h3 className={styles.relatedArtistsHeader}>Related Artists</h3>
        {relatedArtists.map(artist => {
            return(
                <ArtistItem related_artist={artist} height={64}/>
            )
        })}
    </>)
} 