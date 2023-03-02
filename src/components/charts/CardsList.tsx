import Card from './Card';
import PullRequestSVG from '@/assets/pull-request.svg';
import FileSVG from '@/assets/file.svg';
import AddSVG from '@/assets/add.svg';
import MinusSVG from '@/assets/minus.svg';

const CARD_DETAILS = {
    pull_requests: {
        title     : 'Active pull requests',
        icon      : PullRequestSVG,
        class_name: 'pull_request_card',
    },
    files: {
        title     : 'Files changed',
        icon      : FileSVG,
        class_name: 'files_card',
    },
    additions: {
        title     : 'Added lines',
        icon      : AddSVG,
        class_name: 'additions_card',
    },
    deletions: {
        title     : 'Deleted lines',
        icon      : MinusSVG,
        class_name: 'deletions_card',
    },
};

type TCardsList = {
        additions: number;
        deletions: number;
        merged_prs: number;
        number_of_files: number;
        opened_prs: number;
}

const CardsList = ({additions, deletions, merged_prs, number_of_files, opened_prs} : TCardsList) => {
    const details = Object.keys(CARD_DETAILS).map(card => {
        switch(card){
        case 'pull_requests':
            return ({
                ...CARD_DETAILS[card],
                value: merged_prs + opened_prs,
            });
        case 'files':
            return ({
                ...CARD_DETAILS[card],
                value: number_of_files,
            });
        case 'additions':
            return ({
                ...CARD_DETAILS[card],
                value: additions,
            });
        case 'deletions':
            return ({
                ...CARD_DETAILS[card],
                value: deletions,
            });
        default:
            return null;
        }
    });

    return <div className="flex gap-x-5">
        {details.map(detail => {
            return detail ? (
                <Card
                    class_name={detail.class_name}
                    key={detail.title}
                    icon={detail.icon}
                    title={detail.title}
                    value={detail.value}
                />
            )
                : null;
        })}
    </div>;
};

export default CardsList;
