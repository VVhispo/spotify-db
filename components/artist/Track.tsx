import React, {useState, useEffect} from 'react'
import styles from "@/styles/track.module.css"
import Image from 'next/image'
import Link from 'next/link'
import { TrackObject } from '@/interfaces'

interface Props{
    data: TrackObject,
    height: number
}
export const Track: React.FC<Props> = ({data, height}) => {
    const {name, album_name, artists, img_src} = data
    return(<>
        <Link href={`../albums/${artists[0].name}/${album_name}` }>
        <div style={{height:height + "px"}} className={styles.trackItemDiv}>
            <Image src={img_src} height={Math.abs(0.9 * height)} width={Math.abs(0.9 * height)} alt="album cover" priority={true}/>
            <div className={styles.trackItemInfo}>
                <h4>{name}</h4>
                <p>{album_name}</p>
            </div>
        </div>
        </Link>
    </>)
}