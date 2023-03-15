import React, {useState, useEffect} from 'react'
import styles from "@/styles/track.module.css"
import Image from 'next/image'
import Link from 'next/link'

interface Props{
    name: string,
    height: number,
    album: Album
}
interface Album{
    name:string,
    cover_url: string,
    artist: string
}

export const Track: React.FC<Props> = ({name, height, album}) => {
    return(<>
        <Link href={`../artists/${album.artist}/albums/${album.name}` }>
        <div style={{height:height + "px"}} className={styles.trackItemDiv}>
            <Image src={album.cover_url} height={Math.abs(0.9 * height)} width={Math.abs(0.9 * height)} alt="album cover" priority={true}/>
            <div className={styles.trackItemInfo}>
                <h4>{name}</h4>
                <p>{album.name}</p>
            </div>
        </div>
        </Link>
    </>)
}