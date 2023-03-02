import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Menu, MenuItem, Select } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { setMonth } from '@/stores/settings';
import { capitalize } from '@/utils';

type TProps = {
    is_select?: boolean;
    className?: string;
}

const MonthSelector = ({ is_select, className }: TProps) => {
    const { date } = useSelector((state: any) => state.settings);
    const { months } = useSelector((state: any) => state.settings.list);
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const onOpenMonthSelector = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const onSelectMonth = (month: string) => {
        dispatch(setMonth(month));
        setAnchorEl(null);
    };

    const handleChange = (event: SelectChangeEvent) => {
        dispatch(setMonth(event.target.value));
    };

    if (is_select) {
        return (
            <Select
                value={date.month}
                className={className}
                onChange={handleChange}
                size="small"
            >
                {months.map((month: string, idx: number) => {
                    return (
                        <MenuItem
                            key={idx}
                            classes={{ root: month === date.month ? 'active' : ''}}
                            value={month}
                        >
                            {capitalize(month)}
                        </MenuItem>
                    );
                })}
            </Select>
        );
    }

    return (
        <React.Fragment>
            <Button
                variant="contained"
                disableElevation
                color="primary"
                size="small"
                onClick={onOpenMonthSelector}
            >
                Month
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
            >
                {months.map((month: string, idx: number) => {
                    return (
                        <MenuItem
                            key={idx}
                            classes={{ root: month === date.month ? 'active' : ''}}
                            onClick={() => onSelectMonth(month)}
                        >
                            {capitalize(month)}
                        </MenuItem>
                    );
                })}
            </Menu>
        </React.Fragment>
    );
};

export default MonthSelector;
