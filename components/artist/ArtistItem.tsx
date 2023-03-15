import React, {useState, useEffect} from 'react'
import styles from "@/styles/artist.module.css"
import Image from 'next/image'
import Link from 'next/link'

interface Props{
    name: string,
    image_url: string,
    height: number
}

export const ArtistItem: React.FC<Props> = ({name, image_url, height}) => {
    return(<>
        <Link href={`../artists/${name}` }>
        <div style={{height:height + "px"}} className={styles.artistItemDiv}>
            <div style={{height:height + "px", width:height + "px"}}>   
                <Image src={image_url} height={Math.abs(0.9 * height)} width={Math.abs(0.9 * height)} alt="artist" priority={true}/>
            </div>
            <div className={styles.artistItemInfo}>
                <h4>{name}</h4>
            </div>
        </div>
        </Link>
    </>)
}