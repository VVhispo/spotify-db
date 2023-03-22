import React, {useEffect, useState} from 'react'
import { SearchBar } from '@/components/search/SearchBar'
import { searchType, ArtistReference, AlbumReference } from '@/interfaces'
import styles from '@/styles/search.module.css'
import { SearchAlbumItem} from '@/components/search/SearchAlbumItem'
import { SearchArtistItem } from '@/components/search/SearchArtistItem'

const SearchPage: React.FC = () => {
    const [searchType, setSearchType] = useState<searchType>("album")
    const [searchValue, setSearchValue] = useState<string>("")
    const [access_token, setToken] = useState<string | undefined>()
    const [search_results, setSearchResults] = useState<Array<ArtistReference> | Array<AlbumReference>>()

    const getToken = async () => {
        const response = await fetch("api/getAccessToken")
        const { token } = await response.json()
        setToken(token)
    }   

    useEffect(()=>{
        if(!access_token) getToken()
        else if(searchValue.length > 0) getSearchResults()
        else getPlaceholderResults()
    }, [searchValue, searchType, access_token])

    
    const getSearchResults = async() => {
        const query = (searchType == "album") ? `https://api.spotify.com/v1/search?q=${searchValue!.replace(" ", "%20")}&type=album&market=US` :
                                                `https://api.spotify.com/v1/search?q=${searchValue!.replace(" ", "%20")}&type=artist&market=US`

        const res = await fetch(query,{
        headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json"
        },
        });
        const result = await res.json()
        console.log(result)
        let data;
        (searchType == "album") ? data = formatAlbums(result.albums.items) : data = formatArtists(result.artists.items);
        (data.length > 0) ? setSearchResults(data) : getPlaceholderResults
    }

    const getPlaceholderResults = (): Array<ArtistReference> | Array<AlbumReference> => {
        return []
    }

    const formatAlbums = (albums: Array<any>): Array<AlbumReference> => {
        return albums.filter(a=>{
            return a.album_group == 'album' && a.album_type == 'album'
        }).map(a=>{
            return {
                id: a.id,
                artist_name: a.artists[0].name,
                img_src: a.images[0].url,
                name: a.name,
                year: a.release_date.slice(0,4)
            }
        })
    }

    const formatArtists = (artists: Array<any>): Array<ArtistReference> => {
        return artists.filter(a=>{
                return parseInt(a.followers.total)>1000
            }).map(a=>{
            return {
                id: a.id,
                name: a.name,
                img_src: (a.images[0]) ? a.images[0].url : undefined
            }
        })
    }

    return(<div className={styles.mainDiv}>
        <div className={styles.searchBar}>
            <SearchBar setSearchValue={setSearchValue} setSearchType={setSearchType} />
        </div>
        <div className={styles.searchResults}>
            {search_results?.map((item: ArtistReference | AlbumReference) => {                
                return (searchType == "album") ? <SearchAlbumItem key={item.id} data={item as AlbumReference}/> : <SearchArtistItem key={item.id} data={item as ArtistReference}/>
            })}
        </div>

    </div>)
}

export default SearchPage