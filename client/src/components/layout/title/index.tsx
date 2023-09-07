import React from 'react';
import { useRouterContext, TitleProps } from '@refinedev/core';
import Button from '@mui/material/Button';

import logo from '../../../assets/logo.svg';
import yariga from '../../../assets/pokemonClub.svg';

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
    const { Link } = useRouterContext();

    return (
        <div style={{ marginTop: '40px' }}>
            <Button fullWidth variant="text" disableRipple>
                <Link to="/" sx={{ margin: '4px' }}>
                    {collapsed ? (
                        <img src={logo} alt="Yariga" width="28px" />
                    ) : (
                        <img src={yariga} alt="pokemonClub" width="100px" />
                    )}
                </Link>
            </Button>
        </div>
    );
};
