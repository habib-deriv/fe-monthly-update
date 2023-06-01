import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { db } from '@/config/firebase-config';
import {
    collection,
    getDocs,
    QueryDocumentSnapshot,
} from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import groupBy from 'lodash.groupby';
import { setRefresh } from '@/stores/content';

export type TFetchData = {
  id: number;
  [k: string]: any;
};

const useFetch = (
    collection_name: string,
    group_by?: string,
    sort_by?: string[]
): [boolean, TFetchData[], {[k: string | number]: TFetchData[]}] => {
    const { should_refresh } = useSelector((state: any) => state.content);
    const dispatch = useDispatch();
    const [is_loading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<TFetchData[] | null>(null);
    const [grouped_data, setGroupedData] = useState<{[k: string | number]: TFetchData[]} | null>(null);
    const usersCollectionRef = collection(db, collection_name);

    const sortByProperty = (items_array: {[k: string | number]: any}) => {
        if (group_by) {
            if (sort_by && sort_by.length) {
                items_array.sort((a: TFetchData, b: TFetchData) => {
                    return sort_by.indexOf(a[group_by]) - sort_by.indexOf(b[group_by]);
                });
            }
            return groupBy(items_array, group_by);
        }
        return items_array;
    };

    useEffect(() => {
        (async () => {
            if (!data || should_refresh) {
                setIsLoading(true);
                const collections = await getDocs(usersCollectionRef);
                const new_data: TFetchData[] = collections.docs.map(
                    (doc: QueryDocumentSnapshot<DocumentData>) => ({
                        id: doc.id,
                        ...doc.data(),
                    })
                );
                if (group_by) setGroupedData(sortByProperty(new_data));
                setData(new_data);
                setIsLoading(false);
                dispatch(setRefresh(false));
            }
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collection_name, should_refresh]);

    return [is_loading, data || [], grouped_data || {}];
};

export default useFetch;
