import React, {useState} from 'react'
import styles from "@/styles/track.module.css"
import { Track } from './Track'

interface Props{
    topTracks: Array<any>
}

export const TopTracks: React.FC<Props> = ({topTracks}) => {
    return(<>
        <h3 className={styles.topTracksHeader}>Top Tracks</h3>
        {topTracks.map(track => {
            return(
                <Track key={track.id} name={track.name} album={
                    {
                        name:track.album.name,
                        cover_url:track.album.images[0].url,
                        artist: track.album.artists[0].name
                    }
                } height={64}/>
            )
        })}
    </>)
} 