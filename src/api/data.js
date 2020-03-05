import require from '../utils/request'

export function AllData(data){
    return require({
        url:`/rov/generator/data/queryLimitTime`,
        method:'POST',
        data
    })
}

export function PhData(data){
    return require({
        url:`/rov/generator/data/queryLimitTimePh`,
        method:'POST',
        data
    })
}

export function AmmoniaNitrogenData(data){
    return require({
        url:`/rov/generator/data/queryLimitTimeAmmoniaNitrogen`,
        method:'POST',
        data
    })
}

export function H2sData(data){
    return require({
        url:`/rov/generator/data/queryLimitTimeH2s`,
        method:'POST',
        data
    })
}

export function NitriteData(data){
    return require({
        url:`/rov/generator/data/queryLimitTimeNitrite`,
        method:'POST',
        data
    })
}

export function OxygenData(data){
    return require({
        url:`/rov/generator/data/queryLimitTimeOxygen`,
        method:'POST',
        data
    })
}

export function TemperatureData(data){
    return require({
        url:`/rov/generator/data/queryLimitTimeTemperature`,
        method:'POST',
        data
    })
}

export function getSettingFromId(id){
    return require({
        url:`/rov/setting/querySetting`,
        method:'get',
        params:{'id':id}
    })
}

export function updateSetting(data){
    return require({
        url:`/rov/setting/updateSetting`,
        method:'POST',
        data
    })
}

export function download(data){
    return require({
        url:`/rov/generator/data/output`,
        method:"post",
        data
    })
}



