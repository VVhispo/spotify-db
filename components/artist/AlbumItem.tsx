import React, {useState} from 'react'
import styles from '@/styles/album.module.css'
import Image from 'next/image'
import Link from 'next/link'

interface Props{
    name: string, 
    year: number, 
    img_url: string,
    artist_name: string
}

export const AlbumItem: React.FC<Props> = ({name, year, img_url, artist_name}) => {
    return(<>
    <Link href={`../artists/${artist_name}/albums/${name}`}>
        <div className={styles.albumItemDiv}>
            <Image src={img_url} alt="album cover" width="150" height="150" priority={true}></Image>
            <h4>{name}</h4>
            <p>{year.toString().slice(0,4)}</p>
        </div>
    </Link>

    </>)
}