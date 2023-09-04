import { useGetIdentity, useOne } from '@refinedev/core';

import { Profile } from '../components';

const MyProfile = () => {
	const { data: user } = useGetIdentity({
		v3LegacyAuthProviderCompatible: true,
	});
	const { data, isLoading, isError } = useOne({
		resource: 'users',
		id: user?.userid,
	});

	const myProfile = data?.data ?? [];

	if (isLoading) return <div>loading...</div>;
	if (isError) return <div>error...</div>;

	return (
		<Profile
			type='My'
			name='name'
			email='email'
			avatar='avatar'
			properties='allProperties'

			// name={myProfile.name}
			// email={myProfile.email}
			// avatar={myProfile.avatar}
			// properties={myProfile.allProperties}
		/>
	);
};

export default MyProfile;
