import { useSelector, useDispatch } from 'react-redux';
import { TextField } from '@mui/material';
import { setYear } from '@/stores/settings';
import MonthSelector from '@/components/MonthSelector';

const Settings = () => {
    const dispatch = useDispatch();
    const { date } = useSelector((state: any) => state.settings);

    const handleYearChange = (event: any) => {
        dispatch(setYear(event.target.value));
    };

    return (
        <div className="py-10 w-96 mx-auto">
            <div className="flex items-center justify-between mb-2">
                <h3 className="uppercase text-lg font-bold">Settings</h3>
                <div className="flex items-center justify-end"></div>
            </div>
            <div className="border-2 rounded-md bg-gray-100 p-4">
                <div>
                    <span className="text-sm mb-1 block text-black">Year</span>
                    <TextField
                        type="text"
                        className="w-full"
                        size="small"
                        defaultValue={date.year}
                        onChange={handleYearChange}
                    />
                </div>
                <div>
                    <span className="text-sm mb-1 mt-4 block text-black">Month</span>
                    <MonthSelector
                        className="w-full"
                        is_select
                    />
                </div>
            </div>
        </div>
    );
};

export default Settings;
