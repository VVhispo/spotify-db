import React, {useState} from 'react'
import {AlbumReference } from '@/interfaces'
import styles from "@/styles/search.module.css"
import Image from 'next/image'

interface Props{    
    data: AlbumReference
}

export const SearchAlbumItem: React.FC<Props> = ({data}) => {
    const {id, name, img_src, artist_name, year} = data
    return(<div className={styles.itemMainDiv}>
        <Image alt={name} src={img_src} width="200" height="200"/>
        {name}
    </div>)
}