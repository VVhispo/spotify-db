import React, {useState} from 'react'
import styles from '@/styles/album.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { AlbumReference } from '@/interfaces'

interface Props{
    data: AlbumReference
}

export const AlbumItem: React.FC<Props> = ({data}) => {
    const {name, year, img_src, artist_name} = data
    return(<>
    <Link href={`../artists/${artist_name}/albums/${name}`}>
        <div className={styles.albumItemDiv}>
            <Image src={img_src} alt="album cover" width="150" height="150" priority={true}></Image>
            <h4>{name}</h4>
            <p>{year.toString().slice(0,4)}</p>
        </div>
    </Link>

    </>)
}