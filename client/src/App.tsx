import React from 'react';

import { Refine, LegacyAuthProvider as AuthProvider } from '@refinedev/core';
import {
    notificationProvider,
    RefineSnackbarProvider,
    ReadyPage,
    ErrorComponent,
} from '@refinedev/mui';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined';
import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline';
import PeopleAltOutlined from '@mui/icons-material/PeopleAltOutlined';
import StarOutlineRounded from '@mui/icons-material/StarOutlineRounded';
import VillaOutlined from '@mui/icons-material/VillaOutlined';

import dataProvider from '@refinedev/simple-rest';
import routerProvider from '@refinedev/react-router-v6/legacy';
import axios, { AxiosRequestConfig } from 'axios';
import { Title, Sider, Layout, Header } from './components/layout';
import { ColorModeContextProvider } from './contexts/color-mode';
import { CredentialResponse } from './interfaces/google';
import { parseJwt } from './utils/parse-jwt'; //utils/parse-jwt

import {
    Login,
    Home,
    Agents,
    MyProfile,
    PropertyDetails,
    AllProperties,
    CreateProperty,
    AgentProfile,
    EditProperty,
} from './pages';

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (request.headers) {
        request.headers['Authorization'] = `Bearer ${token}`;
    } else {
        request.headers = {
            Authorization: `Bearer ${token}`,
        };
    }

    return request;
});

function App() {
    const authProvider: AuthProvider = {
        login: async ({ credential }: CredentialResponse) => {
            try {
                const profileObj = credential ? parseJwt(credential) : null;

                console.log(profileObj);

                if (profileObj) {
                    const response = await fetch(
                        'http://localhost:5173/api/v1/users',
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                name: profileObj.name,
                                email: profileObj.email,
                                avatar: profileObj.picture,
                            }),
                        }
                    );
                    console.log(response);

                    // if (!response.ok) {
                    //     throw new Error('Failed to create user.'); // Custom error message
                    // }

                    const data = await response.json();

                    localStorage.setItem(
                        'user',
                        JSON.stringify({
                            ...profileObj,
                            avatar: profileObj.picture,
                            userid: data._id,
                        })
                    );
                }

                localStorage.setItem('token', `${credential}`);

                return Promise.resolve();
            } catch (error: any) {
                console.error(' error:', error); // Log the error
                console.error('Login error:', error.message); // Log the error
                return Promise.reject('Login failed. Please try again.'); // Return an error message
            }
        },
        logout: async () => {
            try {
                const token = localStorage.getItem('token');

                if (token && typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    axios.defaults.headers.common = {};
                    window.google?.accounts.id.revoke(token, () => {
                        return Promise.resolve();
                    });
                }

                return Promise.resolve();
            } catch (error: any) {
                console.error('Logout error:', error.message); // Log the error
                return Promise.reject('Logout failed. Please try again.'); // Return an error message
            }
        },
        checkError: () => Promise.resolve(),
        checkAuth: async () => {
            const token = localStorage.getItem('token');

            if (token) {
                return Promise.resolve();
            }

            return Promise.reject('Authentication required.'); // Return an error message
        },

        getPermissions: async () => null,
        getUserIdentity: async () => {
            try {
                const user = localStorage.getItem('user');
                if (user) {
                    return Promise.resolve(JSON.parse(user));
                }
                throw new Error('User not found.'); // Custom error message
            } catch (error: any) {
                console.error('GetUserIdentity error:', error.message); // Log the error
                return Promise.reject('Failed to fetch user data.'); // Return an error message
            }
        },
    };

    return (
        <>
            {/* <ColorModeContextProvider> */}
            <CssBaseline />
            <GlobalStyles styles={{ html: { WebkitFontSmoothing: 'auto' } }} />
            <RefineSnackbarProvider>
                <Refine
                    dataProvider={dataProvider('http://localhost:8080/api/v1')}
                    notificationProvider={notificationProvider}
                    ReadyPage={ReadyPage}
                    catchAll={<ErrorComponent />}
                    resources={[
                        {
                            name: 'properties',
                            list: AllProperties,
                            show: PropertyDetails,
                            create: CreateProperty,
                            edit: EditProperty,
                            icon: <VillaOutlined />,
                        },
                        {
                            name: 'agents',
                            list: Agents,
                            show: AgentProfile,
                            icon: <PeopleAltOutlined />,
                        },
                        {
                            name: 'reviews',
                            list: Home,
                            icon: <StarOutlineRounded />,
                        },
                        {
                            name: 'messages',
                            list: Home,
                            icon: <ChatBubbleOutline />,
                        },
                        {
                            name: 'my-profile',
                            options: { label: 'My Profile ' },
                            list: MyProfile,
                            icon: <AccountCircleOutlined />,
                        },
                    ]}
                    Title={Title}
                    Sider={Sider}
                    Layout={Layout}
                    Header={Header}
                    legacyRouterProvider={routerProvider}
                    legacyAuthProvider={authProvider}
                    LoginPage={Login}
                    DashboardPage={Home}
                />
            </RefineSnackbarProvider>
            {/* </ColorModeContextProvider> */}
        </>
    );
}

export default App;
