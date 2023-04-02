import React, {useState} from 'react'
import { ArtistReference} from '@/interfaces'
import styles from "@/styles/search.module.css"
import Image from 'next/image'

interface Props{    
    data: ArtistReference
}

export const SearchArtistItem: React.FC<Props> = ({data}) => {
    const {id, name} = data
    const img_src = (data.img_src) ? data.img_src : "/default_artist.png"
    console.log(img_src)
    return(<div className={styles.itemMainDiv}>
        <div className={styles.image}>
            <Image alt={name} src={img_src} fill/>
        </div>  
        {name}
    </div>)
}