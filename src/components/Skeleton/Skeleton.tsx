import { Skeleton } from '@mui/material';

type TProps = {
    row: number;
    width?: string;
    height?: string;
}

const SkeletonLoading = ({ row = 3, width = '100%', height = '40px' }: TProps) => {
    const rows = [];

    for(let i = 0; i < row; i++) {
        rows.push(
            <Skeleton
                key={i}
                classes={{ root: 'mb-4' }}
                variant="rounded"
                width={width}
                height={height}
            />
        );
    }

    return (
        <div>
            {rows.map((row) => row)}
        </div>
    );
};

export default SkeletonLoading;
