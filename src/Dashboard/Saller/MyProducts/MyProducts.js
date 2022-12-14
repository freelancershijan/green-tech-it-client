import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Loading from '../../../components/Loading/Loading';
import { AuthContext } from '../../../Context/AuthProvider/AuthProvider';
import useTitle from '../../../hoocks/useTitle';


const MyProducts = () => {
    const { user } = useContext(AuthContext);

    useTitle('My Products')
    console.log('emailllll', user?.email)


    /*    const [myProducts, setMyProducts] = useState([]);
       useEffect(() => {
           fetch(`https://assignment-12-server-neon.vercel.app/my-products/${user?.email}`)
               .then(res => res.json())
               .then(data => {
                   setMyProducts(data)
               })
       }, [user?.email])
   
       console.log('myProducts', myProducts)
   
       */



    const { data: myProducts = [], refetch, isLoading } = useQuery({
        queryKey: ['myProducts'],
        queryFn: async () => {
            try {
                const res = await fetch(`https://assignment-12-server-neon.vercel.app/my-products/${user?.email}`);
                const data = await res.json();
                return data;
            }
            catch (error) {
                console.log(error);
            }
        }
    })


    if (isLoading) {
        return <Loading></Loading>
    }




    // delete product

    const handleDelete = product => {
        fetch(`https://assignment-12-server-neon.vercel.app/my-products/${product._id}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {

                if (data.acknowledged) {
                    toast.success('Product Deleted Successfully')
                    refetch();
                }

                // const remaining= myProducts.filter(product => product._id )
            })

    }
    // advertise product

    const handleAdvertise = product => {
        const advertise = {
            product

        }

        fetch('https://assignment-12-server-neon.vercel.app/advertise', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(advertise)
        })
            .then(res => res.json())
            .then(data => {
                if (data.acknowledged) {
                    toast.success('Product Added Advertise Section Successfully!!!')
                }
            })
    }
    return (
        <div>
            <h2 className='text-3xl text-center font-semibold  mt-10'>My products</h2>

            <div>
                {
                    myProducts.length === 0 ? <h2 className='text-3xl font-semibold mt-10 text-center'>You Have not any Products</h2> :
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 m-5 md:m-20'>
                            {
                                myProducts.map(product => <div key={product._id} className="card w-full shadow-xl">
                                    <figure><img className='w-full h-96' src={product.photo} alt="Products" /></figure>
                                    <div className="card-body">
                                        <h2 className="card-title">{product.name}</h2>
                                        <h2 className='text-xl'>Seller Name: <span className='font-semibold italic text-blue-900'>{product.salerName}</span></h2>
                                        <h2 className='text-xl'>Condition: <span className='font-semibold italic text-blue-900'>{product?.condition}</span></h2>
                                        <h2 className='text-xl'>Brand: <span className='font-semibold italic text-blue-900'>{product?.category}</span></h2>
                                        <h2 className='text-xl'>Sale Price: <span className='font-semibold italic text-blue-900'>{product.resalePrice} BDT</span></h2>
                                        <div className='flex justify-evenly mt-10'>

                                            <Link onClick={() => handleDelete(product)}>
                                                <button className="btn bg-red-700">Delete</button>

                                            </Link>
                                            <Link onClick={() => handleAdvertise(product)}>
                                                <button className="btn bg-green-800">Advertise</button>
                                            </Link>
                                            <Link to={`/products/sp/${product._id}`}>
                                                <div className="card-actions">
                                                    <button className="btn btn-primary">See Details</button>
                                                </div>
                                            </Link>
                                        </div>

                                    </div>
                                </div>)
                            }
                        </div>
                }
            </div>
        </div>
    );
};

export default MyProducts;