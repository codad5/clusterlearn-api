import Validator from "../utils/Validator"
import CourseModel  from "../models/course";
import { avaliablePlatform } from "../types/modelData";
import AddToCourseExceptions from "../utils/Exceptions/AddToCourseException";

const avaliable_platform : avaliablePlatform[] = ['udemy.com' , 'edx.com']
export default class RegisterUserToCourse {
    static async register(url : string, email : string, paid : boolean = false){

        if(!Validator.isValidEmail(email)) throw new AddToCourseExceptions('invalid email', url, 400);
        if(!Validator.isValidUrl(url)) throw new AddToCourseExceptions('invalid Course url', url, 400);
        const parsedUrl = new URL(url);
        const host = parsedUrl.host.replace('www.', '')
        url = `${parsedUrl.protocol}//${host}${parsedUrl.pathname}`;
        if(!avaliable_platform.includes(host as avaliablePlatform)) throw new AddToCourseExceptions('Platform not supported', url, 400);
        if(! await CourseModel.getCousre(url)) await CourseModel.createCourse({
            name: parsedUrl.pathname,
            link: url,
            platform: host as avaliablePlatform,
            groups: {
                free: [],
                paid: []
            }
        });

        return paid ? await CourseModel.addUserToCoursePaid(url, email) : await CourseModel.addUserToCourseFree(url, email);

    }
}