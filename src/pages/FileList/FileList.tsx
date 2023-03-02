import React from 'react';
import moment from 'moment';
import SkeletonLoading from '@components/Skeleton';
import { Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Snackbar } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const API_URL =
  'https://api.github.com/repos/farzin-deriv/deriv-dynamic-videos/actions/artifacts';
const HEADER = {
    Accept       : 'application/vnd.github+json',
    Authorization: import.meta.env.VITE_REMOTION_AUTHORIZATION_TOKEN ?? '',
};

type TFileListItem = {
    id: string;
    name: string;
    size_in_bytes: string;
    archive_download_url: string;
    updated_at: string;
}

type TResponse = {
    artifacts: TFileListItem[];
    total_count: number;
}

const FileList = () => {
    const [items, setItems] = React.useState<TResponse>({ artifacts: [], total_count: 0 });
    const [is_loading, setLoading] = React.useState(false);
    const [is_loading_download, setLoadingDownload] = React.useState(false);

    const fetchList = () => {
        setLoading(true);
        fetch(API_URL, {
            method : 'GET',
            headers: HEADER,
        }).then((response) => {
            if (response.ok) return response.json();
            throw response;
        }).then((data) => {
            setItems(data);
        }).finally(() => {
            setLoading(false);
        });
    };

    React.useEffect(() => {
        fetchList();
    }, []);

    const downloadFile = (url: string) => {
        setLoadingDownload(true);
        fetch(url, { headers: HEADER, })
            .then( res => res.blob() )
            .then( blob => {
                var file = window.URL.createObjectURL(blob);
                window.location.assign(file);
            }).finally(() => {
                setLoadingDownload(false);
            });
    };

    return (
        <div className="p-10">
            {is_loading && <SkeletonLoading row={6} />}
            
            {!is_loading && (
                <React.Fragment>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center justify-start basis-1/3">
                            <h3 className="uppercase text-lg font-bold mr-2">Files</h3>
                        </div>
                        <div className="flex items-center justify-end">
                            <Button
                                variant="contained"
                                disableElevation
                                color="secondary"
                                size="small"
                                className="ml-2"
                                onClick={() => fetchList()}
                            >
                                Refresh
                            </Button>
                        </div>
                    </div>

                    <div>
                        <Table
                            size="small"
                            classes={{ root: 'rounded-md border' }}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        variant="head"
                                        align="center"
                                    >
                                        Name
                                    </TableCell>
                                    <TableCell
                                        variant="head"
                                        align="center"
                                    >
                                        Date
                                    </TableCell>
                                    <TableCell
                                        variant="head"
                                        align="center"
                                    >
                                        Size
                                    </TableCell>
                                    <TableCell
                                        variant="head"
                                        align="center"
                                    >
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.artifacts.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell align="center">
                                            <span className="text-xs">{row.name}</span>
                                        </TableCell>
                                        <TableCell align="center">
                                            <span className="text-xs">{moment(row.updated_at).format('DD/MM/YYYY')}</span>
                                        </TableCell>
                                        <TableCell align="center">
                                            <span className="text-xs">
                                                {`${(Number(row.size_in_bytes) / 1000000).toFixed(2)} MB`}
                                            </span>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                aria-label="download-file"
                                                color="primary"
                                                disabled={is_loading_download}
                                                size="small"
                                                onClick={() => downloadFile(row.archive_download_url)}
                                            >
                                                <FileDownloadIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <Snackbar
                        open={is_loading_download}
                        message="Download will start shortly. Please wait..."
                    />
                </React.Fragment>
            )}
        </div>
    );
};

export default FileList;
