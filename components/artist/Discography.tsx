import React, {useState, useRef, useEffect} from 'react'
import { AlbumItem } from './AlbumItem'
import styles from "@/styles/slider.module.css"
import { userAgentFromString } from 'next/server'
import { AlbumReference } from '@/interfaces'

interface Props{
    albums: Array<AlbumReference>,
    artistId: string,
}

export const Discography: React.FC<Props> = ({albums}) => {
    const [slider, setSlider] = useState<boolean>(true)
    const [arr_albums, setAlbums] = useState<Array<any>>(albums)
    const mainDiv = useRef<HTMLDivElement>(null)
    const [counterRight, setCounter] = useState<number>(0)

    useEffect(()=>{
        window.addEventListener("resize", handleResize, false)
        if(albums) handleResize()
    }, [])
    const handleResize = () =>{
        console.log("==========RESIZE")
        // console.log([...albums].slice(counterRight, Math.floor((document.body.clientWidth - 100) / 175) + counterRight))
        // console.log(albums)
        setAlbums([...albums].slice(counterRight, Math.floor((document.body.clientWidth - 100) / 175) + counterRight))
        if(arr_albums.slice(0,Math.floor((document.body.clientWidth - 100) / 175)).length == albums.length) setSlider(false)
        else setSlider(true)
    }
    const moveRight = () => {
        if(counterRight < albums.length - Math.floor((document.body.clientWidth - 100) / 175)){
            setAlbums([...albums].slice(counterRight + 1, Math.floor((document.body.clientWidth - 140) / 175) + counterRight + 1))
            setCounter(counterRight + 1)
        }
    }
    const moveLeft = () => {
        if(counterRight > 0){
            setAlbums([...albums].slice(counterRight - 1, Math.floor((document.body.clientWidth - 150) / 175) + counterRight - 1))
            setCounter(counterRight - 1)
        }
    }

    if(slider){
        return(<div className={styles.mainCarouseleDiv} ref={mainDiv}>
            <div className={styles.arrowLeft} onClick={moveLeft}></div>
            {arr_albums.map(album=>{
                return <AlbumItem key={album.id} data={album} />
            })}
            <div className={styles.arrowRight} onClick={moveRight}></div>
        </div>)
    }else{
        return(<div className={styles.mainCarouseleDiv} >
            {albums.map(album=>{
                return <AlbumItem key={album.id} data={album} />
            })}
        </div>)
    }

}