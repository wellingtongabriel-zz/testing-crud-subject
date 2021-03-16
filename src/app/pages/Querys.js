import {String} from '../utils';

export const createSearchQuery = data => {
    let {objName, name, page, attrsReturn} = data;

    const nameRequest = 'findAll'.concat(String.capitalize(name));
    const pagination = String.stringify(page);

    return {
        query: `{
            query: ${nameRequest} (${objName}: ${pagination})  {
                ${attrsReturn}
            }
        }`
    };
};

export const createFindAllQuery = data => {
    let {objName, name, page, attrsReturn} = data;

    const nameRequest = 'findAll'.concat(name);
    const pagination = String.stringify(page);

    return {
        query: `{
            query: ${nameRequest} (${objName}: ${pagination})  {
                ${attrsReturn}
            }
        }`
    };
};

export const createFindByIdQuery = data => {
    let {objName, name, attrsReturn} = data;

    const nameRequest = 'findById'.concat(String.capitalize(name));

    return {
        query: `{
            query: ${nameRequest} (${objName})  {
                ${attrsReturn}
            }
        }`
    };
};

export const createFindByObjectQuery = data => {
    let {objName, objType, name, attrsReturn} = data;
    const nameRequest = 'findBy'.concat(String.capitalize(name));

    return `
            query ($${objName}: ${objType}) { 
                ${nameRequest} (${objName}:$${objName})  {
                    ${attrsReturn}
                }
            }`;
};

export const createQuery = data => {
    let {objName, name, attrsReturn} = data;

    const nameRequest = name;
    const objNameRequest = objName ? '(' + objName + ')' : '';

    return {
        query: `{
            query: ${nameRequest} ${objNameRequest}  {
                ${attrsReturn}
            }
        }`
    };
};


export const createMutation = (data, typeRequest) => {
    let {objName, objType, name, attrsReturn} = data;

    return `
            ${typeRequest} ($${objName}: ${objType}) { 
                ${name} (${objName} : $${objName})  {
                    ${attrsReturn}
                }
            }`;
};