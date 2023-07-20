import {v4 as uuid} from 'uuid';

import team1 from '../../assets/img/team/1.jpg';
import team2 from '../../assets/img/team/2.jpg';
import team3 from '../../assets/img/team/3.jpg';
import team4 from '../../assets/img/team/4.jpg';
import team5 from '../../assets/img/team/5.jpg';
import team6 from '../../assets/img/team/6.jpg';
import team7 from '../../assets/img/team/7.jpg';
import team8 from '../../assets/img/team/8.jpg';
import team9 from '../../assets/img/team/9.jpg';
import team10 from '../../assets/img/team/10.jpg';
import team11 from '../../assets/img/team/11.jpg';
import team12 from '../../assets/img/team/12.jpg';
import team13 from '../../assets/img/team/13.jpg';
import team14 from '../../assets/img/team/14.jpg';
import team15 from '../../assets/img/team/15.jpg';
import team16 from '../../assets/img/team/16.jpg';
import team17 from '../../assets/img/team/17.jpg';
import team18 from '../../assets/img/team/18.jpg';
import team19 from '../../assets/img/team/19.jpg';
import team20 from '../../assets/img/team/20.jpg';
import team21 from '../../assets/img/team/21.jpg';
import team22 from '../../assets/img/team/22.jpg';
import team23 from '../../assets/img/team/23.jpg';
import team24 from '../../assets/img/team/24.jpg';
import team25 from '../../assets/img/team/25.jpg';
import {getRandomInt, getRandomItems} from "../../helpers/utils";


const avatars = [team1, team11, team12, team4, team13, team6, team7, team8, team2, team3, team9, team10]
const names = ['김모둠', '이민지', '김민수', '박준우', '김민지', '김도현', '김지민', '박서연', '정우진', '황준서', '김보람','이수연','은찬규']

const interest_names = ['히오스', '오버워치', '게임', '프로그래밍', '스타트업', '진로', '영어회화']

const bios = ['이것저것 하고 싶은 게 많은 사람입니다', '2021 목표: -5kg', '17 SNU CBA + CSE\n언제나 겸손하기', "You'll Never Walk Alone", '이것저것 하고 싶은 게 많은 사람입니다', '2021 목표: -5kg', '17 SNU CBA + CSE\n언제나 겸손하기', "You'll Never Walk Alone", '이것저것 하고 싶은 게 많은 사람입니다', '2021 목표: -5kg', '17 SNU CBA + CSE\n언제나 겸손하기', "You'll Never Walk Alone", '이것저것 하고 싶은 게 많은 사람입니다', '2021 목표: -5kg', '17 SNU CBA + CSE\n언제나 겸손하기', "You'll Never Walk Alone",]

const profiles = avatars.map((image_url, index) => {
    return {
        pk: uuid(),
        image_url: image_url,
        name: names[index],
        status: bios[index],
        interests: getRandomItems(interest_names, getRandomInt(4, 4)).map((name, index) => {
            return {
                id: uuid(),
                name: name,
                weight: getRandomInt(1, 10)
            }
        }),
        score: getRandomInt(50, 100),
        traits: ['긍정적인', '주도적인', '활발한', '심심한']
    }
});

export const profile = profiles[0]
export const users = [...profiles.slice(1, profiles.length), ...profiles.slice(1, profiles.length)]