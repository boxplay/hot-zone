import shortid from 'shortid'
import { map, assoc, omit } from 'ramda'

export const addid = map(assoc('id', shortid.generate()))

export const removeid = map(omit(['id']))

// 判断是否是移动端
export const isMobile = () => {
    let ua = navigator.userAgent.toLowerCase();
    let is_mobile =
        ua.match(
            /(ipod|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince)/i
        ) != null;
    let is_kkbApp = ua.indexOf('kkbmobile') !== -1;
    if (is_mobile) {
        return true;
    }
};