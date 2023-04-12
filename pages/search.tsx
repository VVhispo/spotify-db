import React, {useEffect, useState} from 'react'
import { SearchBar } from '@/components/search/SearchBar'
import { searchType, ArtistReference, AlbumReference } from '@/interfaces'
import styles from '@/styles/search.module.css'
import { SearchAlbumItem} from '@/components/search/SearchAlbumItem'
import { SearchArtistItem } from '@/components/search/SearchArtistItem'
import { NewReleases } from '@/components/NewReleases'

const SearchPage: React.FC = () => {
    const [searchType, setSearchType] = useState<searchType>("album")
    const [searchValue, setSearchValue] = useState<string>()
    const [access_token, setToken] = useState<string | undefined>()
    const [search_results, setSearchResults] = useState<Array<ArtistReference> | Array<AlbumReference>>()

    const getToken = async () => {
        const response = await fetch("api/getAccessToken")
        const { token } = await response.json()
        setToken(token)
    }   

    useEffect(()=>{
        if(!access_token) getToken()
        else getSearchResults()
    }, [searchValue, searchType, access_token])

    
    const getSearchResults = async() => {
        if(searchValue === undefined) return
        const getResults = await fetch("api/search/results",{
            method:'POST',
            body: JSON.stringify({
                token:access_token,
                searchValue,
                searchType,
            }),
            headers:{ 'Content-Type':'application/json'}
        });
        const results = await getResults.json()
        if(getResults.status == 500) return
        setSearchResults(results)
    }


    return(<div className={styles.mainDiv}>
        <div className={styles.searchBar}>
            <SearchBar setSearchValue={setSearchValue} setSearchType={setSearchType} />
        </div>
        <div className={styles.searchResults}>
            {(searchValue !== undefined) ? search_results?.map((item: ArtistReference | AlbumReference) => {                
                return (searchType == "album") ? <SearchAlbumItem key={item.id} data={item as AlbumReference}/> : <SearchArtistItem key={item.id} data={item as ArtistReference}/>
            }):
            <NewReleases />
            }
        </div>

    </div>)
}

export default SearchPage