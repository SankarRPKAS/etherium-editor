import React, { useState } from 'react';

const CodeEditorWithLineNumbers = () => {
    const [code, setCode] = useState('');
    const [lineCount, setLineCount] = useState(1);
    const [message, setMessage] = useState([]);

    const handleCodeChange = (e) => {
        const lines = e.target.value.split('\n');

        setCode(e.target.value);
        setLineCount(lines.length);
    };

    const isNumber = (n) => {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    const validatator = (arr) => {
        let errorMessages = "";
        let duplicate = "";

        if (!arr.length || !code.trim()) {
            return { isValid: false, messages: "No address" };
        }

        arr.map((data, index) => {
            duplicate = ""
            let error = "";
            const spltData = data.split(/[=, ]+/);
            const pattern = /^(0x)?[0-9a-fA-F]{40}$/;
            let duplicateCot = false;
            const sameAdds = arr.filter((str, index2) => {
                if (str === data && spltData.length > 1 && isNumber(spltData[1])) {
                    duplicate += " " + (index2 + 1);
                    if (index2 < index) {
                        duplicateCot = true;
                    }
                }
                return str === data
            });

            if (!data.trim()) {
                return data
            }

            if (spltData.length !== 2) {
                error = "invalid address or amount";
            } else if (!pattern.test(spltData[0])) {
                error = "invalid address";
            } else if (!isNumber(spltData[1])) {
                error = "amount invalid";
            }

            if (sameAdds.length > 1 && !duplicateCot) {
                error = (error ? error + " and duplicate address" : "duplicate address") + " " + duplicate;
            }

            if (error) {
                errorMessages = errorMessages + `Line ${index + 1} ${error}@`
            }

            return data;
        })

        return { isValid: errorMessages ? false : true, messages: errorMessages || 'Success' };
    }

    const handleNext = () => {
        const addresses = code.split('\n');
        const valid = validatator(addresses);

        if (valid.isValid) {
            alert("Successfully verified Etherium addresses");
            setMessage([]);
        } else {
            const tempArr = valid.messages ? valid.messages.split("@") : [];

            if (tempArr.length > 1)
                tempArr.pop()

            setMessage(tempArr);
        }
    }

    const handleKeepandCombine = (type) => {
        const arr = code.split('\n');
        let keepfirst = [];

        const checkAddress = (address,targetadd) => {
            const spltData = address.split(/[=, ]+/);
            const spltData2 = targetadd.split(/[=, ]+/);

            return spltData[0] === spltData2[0];
        }

        for (let i = 0; i < arr.length; i++) {
            let count = 0;

            if (type !== "firstone") {
                const spltData = arr[i].split(/[=, ]+/);

                if (spltData.length > 1 && isNumber(spltData[1])) {
                    count += parseInt(spltData[1]);
                }
                for (let j = i + 1; j < arr.length; j++) {
                    if (keepfirst.find((address) => checkAddress(address, spltData[0]))) {
                        break;
                    }
                    if (arr[i] === arr[j]) {
                        const spltData = arr[j].split(/[=, ]+/);

                        if (spltData.length > 1 && isNumber(spltData[1])) {
                            count += parseInt(spltData[1]);
                        }
                    }
                }
            }
            if (!keepfirst.find((address) => checkAddress(address, arr[i]))) {
                const spltData = String(arr[i]).split(/[=, ]+/);
                const lastIn = String(arr[i]).lastIndexOf(spltData[1]);
                const slicStr = String(arr[i]).slice(0,lastIn);

                keepfirst.push(count && spltData.length === 2 ? slicStr + count : arr[i]);
            }
        }

        setCode(keepfirst.join('\n'));
    }

    return (
        <div className='h-full bg-zinc-800 p-4 overflow-auto'>
            <div className='text-white text-left'>Address with amounts</div>
            <div className="flex flex-row w-full bg-black h-3/4 mx-auto m-1 rounded-xl">
                <div className="w-16 h-auto text-white p-2">
                    {/* Line numbers */}
                    {Array.from({ length: lineCount }).map((_, index) => (
                        <div key={index} className="text-right">
                            {index + 1}
                        </div>
                    ))}
                </div>
                <div className="w-full h-auto text-white border-l-2 p-2">
                    {/* Code input */}
                    <textarea
                        className="w-full h-full bg-transparent border-none outline-none resize-none"
                        value={code}
                        onChange={handleCodeChange}
                        placeholder="Enter your code here..."
                    />
                </div>
            </div>
            {Boolean(message.length) && message.join().includes("duplicate") &&
                <div className='flex justify-end'>
                    <div className='flex'>
                        <div className='text-red-600 cursor-pointer' onClick={() => { handleKeepandCombine('firstone') }}>Keep first one</div>&nbsp;<span className='text-red-600'>|</span>&nbsp;<div className='text-red-600 cursor-pointer' onClick={() => { handleKeepandCombine('') }}>combine balance</div>
                    </div>
                </div>}
            {Boolean(message.length) && <div class="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <svg class="flex-shrink-0 inline w-4 h-4 mr-3 mt-[2px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span class="sr-only">Info</span>
                <div>
                    <span class="font-medium">Check below errors:</span>
                    <ul class="mt-1.5 ml-4 list-disc list-inside list-left">
                        {message.map((str) => <li className='text-left'>{str}</li>)}
                    </ul>
                </div>
            </div>}
            <button class="bg-gradient-to-r from-purple-500 via-purple-500 to-indigo-500 text-white font-bold py-2 px-4 rounded-full w-full" onClick={handleNext}>
                Next
            </button>
        </div>
    );
};

export default CodeEditorWithLineNumbers;
