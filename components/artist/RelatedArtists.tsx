import React, {useState} from 'react'
import styles from "@/styles/artist.module.css"
import { Track } from './Track'
import { RelatedArtistItem } from './RelatedArtistItem'
import { ArtistReference } from '@/interfaces'

interface Props{
    relatedArtists: Array<ArtistReference>
}

export const RelatedArtists: React.FC<Props> = ({relatedArtists}) => {
    return(<>
        <h3 className={styles.relatedArtistsHeader}>Related Artists</h3>
        {relatedArtists.map(artist => {
            return(
                <RelatedArtistItem key={artist.id} related_artist={artist} height={64}/>
            )
        })}
    </>)
} 