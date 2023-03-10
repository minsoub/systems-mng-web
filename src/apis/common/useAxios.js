import { useState, useEffect } from 'react';

const useAxios = () => {
    const [response, setResponse] = useState();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [controller, setController] = useState();

    const axiosFetch = async (configObj) => {
        const { axiosInstance, method, url, requestConfig = {} } = configObj;

        try {
            setLoading(true);
            const ctrl = new AbortController();
            setController(ctrl);
            const res = await axiosInstance[method](url, {
                ...requestConfig,
                signal: ctrl.signal
            });
            console.log('success', res);
            setResponse(res.data);
        } catch (err) {
            console.log('error', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log(controller);

        // useEffect cleanup function (memory-leak-and-useeffect)
        return () => controller && controller.abort();
    }, [controller]);

    return [response, error, loading, axiosFetch];
};

export default useAxios;
