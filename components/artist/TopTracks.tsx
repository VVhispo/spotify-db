import React, {useState} from 'react'
import styles from "@/styles/track.module.css"
import { Track } from './Track'
import { TrackObject } from '@/interfaces'

interface Props{
    topTracks: Array<TrackObject>
}

export const TopTracks: React.FC<Props> = ({topTracks}) => {
    return(<>
        <h3 className={styles.topTracksHeader}>Top Tracks</h3>
        {topTracks.map(track => {
            return(
                <Track key={track.id} data={track} height={64}/>
            )
        })}
    </>)
} 