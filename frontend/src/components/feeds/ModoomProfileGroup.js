import React, {Fragment} from 'react';
import Avatar from "../common/Avatar";
import ProfileAvatar from "../common/ProfileAvatar";

const ModoomProfileGroup = ({size, modoom, limit, useLink}) => {
    const n_vacancies = modoom.accom - modoom.n_members;
    const n_hidden_members = Math.max(modoom.n_members - limit, 0);
    const profiles = [...modoom.enrollments.filter(e => e.accepted).map(e => e.profile), ...Array(n_vacancies)].slice(0, limit).reverse();
    return (
        <div className='d-flex align-items-center'>
            <div className='icon-group align-items-center' style={{marginLeft: '-5px'}}>
                {profiles.map((profile, index) => {
                    if (profile) {
                        return <ProfileAvatar className='icon-item'
                                              key={profile.uid}
                                              useLink={useLink}
                                              size='2xl'
                                              profile={profile}
                                              style={{width: size, height: size}}/>;
                    } else {
                        return <div key={index} className='avatar icon-item bg-soft-primary'
                                    style={{width: size, height: size}}/>
                    }
                })}
            </div>
            {!!n_hidden_members && <div className='fs--2 font-weight-medium text-800' style={{marginLeft: '0.6rem'}}>
                +{n_hidden_members}
            </div>}
        </div>
    );
};

export default React.memo(ModoomProfileGroup);