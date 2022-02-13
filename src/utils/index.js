export const getRandomItem = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

export const getSum = (numArr) => {
    return numArr.reduce((partialSum, a) => partialSum + a, 0);
};

export const breakNumber = (num, parts) => {
    let res = [];

    for (let i = 0; i < parts - 1; i++) {
        const delta = Math.floor((num - getSum(res)) / (parts - i));
        const part = Math.round(Math.random() * delta / 2 + delta);

        res.push(part);
    }
    res.push(num - getSum(res));

    return res;
}
