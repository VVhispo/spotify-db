import React, {useState, useEffect} from 'react'
import styles from "@/styles/artist.module.css"
import Image from 'next/image'
import Link from 'next/link'
import { ArtistReference } from '@/interfaces'

interface Props{
    related_artist: ArtistReference,
    height:number
}

export const RelatedArtistItem: React.FC<Props> = ({related_artist, height}) => {
    const {name, img_src, id} = related_artist
    return(<>
        <Link href={`../artists/${name}` }>
        <div style={{height:height + "px"}} className={styles.artistItemDiv}>
            <div style={{height:height + "px", width:height + "px"}}>   
                <Image key={img_src} src={img_src ?? ""} height={Math.abs(0.9 * height)} width={Math.abs(0.9 * height)} alt="artist" priority={true}/>
            </div>
            <div className={styles.artistItemInfo}>
                <h3>{name}</h3>
            </div>
        </div>
        </Link>
    </>)
}