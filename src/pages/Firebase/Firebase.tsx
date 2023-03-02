import { useState } from 'react';
import {
    createRecord,
    updateRecord,
    deleteRecord,
} from '@/utils/db-operations';
import { useFetch } from '@/hooks';
import { COLLECTIONS } from '@/constants';

const Firebase = () => {
    const [newRecord, setNewRecord] = useState('');
    const [is_loading, data] = useFetch(COLLECTIONS.ROADMAP);

    if (is_loading) return <div>Loading...</div>;

    return (
        <div className="App">
            <input
                placeholder="Roadmap Title..."
                onChange={(e) => setNewRecord(e.target.value)}
            />
            <button
                onClick={() => createRecord(COLLECTIONS.ROADMAP, { title: newRecord })}
            >
        Create Record
            </button>

            {data.map((record: any) => {
                return (
                    <div key={record.id}>
                        <h1>Roadmap Title: {record.title}</h1>
                        <button
                            onClick={() =>
                                updateRecord(COLLECTIONS.ROADMAP, record.id, {
                                    title: newRecord,
                                })
                            }
                        >
              Update record
                        </button>
                        <button
                            onClick={() => deleteRecord(COLLECTIONS.ROADMAP, record.id)}
                        >
              Delete record
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default Firebase;
