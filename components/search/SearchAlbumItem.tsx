import React, {useState} from 'react'
import {AlbumReference } from '@/interfaces'
import styles from "@/styles/search.module.css"
import Image from 'next/image'
import Link from 'next/link'

interface Props{    
    data: AlbumReference,
}

export const SearchAlbumItem: React.FC<Props> = ({data}) => {
    const {id, name, img_src, artist_name, year} = data
    return(<div className={styles.itemMainDiv}>
        <div className={styles.image}>
            <Link href={"./albums/" + artist_name + "/" + name}>
                <Image alt={name} src={img_src} fill priority={true}/>
            </Link>
        </div>
        <div className={styles.info}>
            <p>{name}</p>
            <Link href={"./artists/" + artist_name}><p className={styles.artistName}>{artist_name}</p></Link>
        </div>
    </div>)
}