import { memo } from 'react'

function Profile() {
    console.log('profile')
    return (
        <h1>Profile</h1>
    )
}

export default memo(Profile)