import { Avatar, Typography, Button } from '@material-tailwind/react';
import {
  MapPinIcon,
  BriefcaseIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/solid';
import { Footer } from '@/widgets/layout';
import React, { useEffect, useState } from 'react';
import { number } from 'prop-types';
//const backendUrl = import.meta.env.VITE_BACKEND_URL;
const backendUrl = 'https://node-auth-jwt-api-rest-tsc-production.up.railway.app';

export function Profile() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  // Function to fetch user details (name and email)
  const fetchUserProfile = async (id) => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      const response = await fetch(`${backendUrl}/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEmail(data.email); // Set the email from the response
        setName(data.name); // Set the name from the response
      } else {
        console.error('Error fetching user details');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Fetch user profile when component mounts
  useEffect(() => {
    const id = localStorage.getItem('userId'); // Obtener el userId de localStorage
    if (id) {
      fetchUserProfile(id); // Fetch user profile
    } else {
      setError('User ID not found');
    }
  }, []); // Empty dependency array ensures it runs once on mount

  return (
    <>
      <section className="relative block h-[50vh]">
        <div className="bg-profile-background absolute top-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center scale-105" />
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
      </section>
      <section className="relative bg-white py-16">
        <div className="relative mb-6 -mt-40 flex w-full px-4 min-w-0 flex-col break-words bg-white">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row justify-between">
              <div className="relative flex gap-6 items-start">
                <div className="-mt-20 w-40">
                  <Avatar
                    src="/img/team-5.png"
                    alt="Profile picture"
                    variant="circular"
                    className="h-full w-full"
                  />
                </div>
                <div className="flex flex-col mt-2">
                  <Typography variant="h4" color="blue-gray">
                    {name ? name : 'Manya Valecha'}
                  </Typography>
                  <Typography
                    variant="h4"
                    color="gray"
                    className="!mt-0 font-normal"
                  >
                    {email ? email : 'manyavalechaofficial@gmail.com'}
                  </Typography>
                </div>
              </div>

              <div className="mt-10 mb-10 flex lg:flex-col justify-between items-center lg:justify-end lg:mb-0 lg:px-4 flex-wrap lg:-mt-5">
                <Button className="bg-gray-900 w-fit lg:ml-auto">
                  Connect
                </Button>
                <div className="flex justify-start py-4 pt-8 lg:pt-4">
                  <div className="mr-4 p-3 text-center">
                    <Typography
                      variant="lead"
                      color="blue-gray"
                      className="font-bold uppercase"
                    >
                      22
                    </Typography>
                    <Typography
                      variant="small"
                      className="font-normal text-blue-gray-500"
                    >
                      Friends
                    </Typography>
                  </div>
                  <div className="mr-4 p-3 text-center">
                    <Typography
                      variant="lead"
                      color="blue-gray"
                      className="font-bold uppercase"
                    >
                      10
                    </Typography>
                    <Typography
                      variant="small"
                      className="font-normal text-blue-gray-500"
                    >
                      Photos
                    </Typography>
                  </div>
                  <div className="p-3 text-center lg:mr-4">
                    <Typography
                      variant="lead"
                      color="blue-gray"
                      className="font-bold uppercase"
                    >
                      89
                    </Typography>
                    <Typography
                      variant="small"
                      className="font-normal text-blue-gray-500"
                    >
                      Comments
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
            <div className="-mt-4 container space-y-2">
              <div className="flex items-center gap-2">
                <MapPinIcon className="-mt-px h-4 w-4 text-blue-gray-500" />
                <Typography className="font-medium text-blue-gray-500">
                  New Delhi , India
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <BriefcaseIcon className="-mt-px h-4 w-4 text-blue-gray-500" />
                <Typography className="font-medium text-blue-gray-500">
                  Software Engineer 
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <BuildingLibraryIcon className="-mt-px h-4 w-4 text-blue-gray-500" />
                <Typography className="font-medium text-blue-gray-500">
                  Delhi Technological University (DTU)
                </Typography>
              </div>
            </div>
            <div className="mb-10 py-6">
              <div className="flex w-full flex-col items-start lg:w-1/2">
                <Typography className="mb-6 font-normal text-blue-gray-500">
                A software developer is a digital alchemist, transforming lines of code into living, breathing solutions. With fingers dancing across the keyboard, they sculpt logic into innovation—building bridges between ideas and execution. Whether crafting seamless user experiences or solving complex algorithms, they write the future, one function at a time.
                </Typography>
                <Button variant="text">Show more</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="bg-white">
        <Footer />
      </div>
    </>
  );
}

export default Profile;
