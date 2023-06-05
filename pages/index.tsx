import React, { useEffect, useState } from 'react'

import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'

// Components
import { BackgroundImage1, BackgroundImage2, GradientBackgroundCon, FooterCon, FooterLink, RedSpan, QuoteGeneratorCon, QuoteGeneratorInnerCon, QuoteGeneratorTitle, QuoteGeneratorSubTitle, GenerateQuoteButton, GenerateQuoteButtonText } from '@/components/QuoteGenerator/QuoteGeneratorElements'

// Assets
import Clouds1 from '../assets/cloud-and-thunder.png'
import Clouds2 from '../assets/cloudy-weather.png'
import { API } from 'aws-amplify'
import { quoteQueryName } from '@/src/graphql/queries'
import { GraphQLResult } from '@aws-amplify/api-graphql'


// interface for the DynamoDB object
interface UpdateQuoteInfoData {
  id: string;
  queryName: string;
  quotesGenerated: number;
  createdAt: string;
  updatedAt: string;
}

// type guard for our fetch function
function isGraphQLResultForquoteQueryName(response: any): response is GraphQLResult<{
  quoteQueryName: {
    items: [UpdateQuoteInfoData];
  };
}> {
  return response.data && response.data.quoteQueryName && response.data.quoteQueryName.items
}

export default function Home() {
  const [numberOfQuotes, setNumberOfQuotes] = useState<Number | null>(0);

  //function to fetch the DynamoDB object (quotes generated)
  const updateQuoteInfo = async () => {
    try {
      const response = await API.graphql<UpdateQuoteInfoData>({
        query: quoteQueryName,
        authMode: "AWS_IAM",
        variables: {
          queryName: "LIVE",
        },
      })
      console.log('response', response);
      // setNumberOfQuotes();

      //Create type guards
      if (!isGraphQLResultForquoteQueryName(response)) {
        throw new Error('Unexpected response from API.graphql')
      }

      if (!response.data) {
        throw new Error('Response Data is undefined');
      }

      const receivedNumberOfQuotes = response.data.quoteQueryName.items[0].quotesGenerated;
      setNumberOfQuotes(receivedNumberOfQuotes);

    } catch (error) {
      console.log('error getting quote data', error)
    }
  }

  useEffect(() => {
    updateQuoteInfo();
  }, [])

  return (
    <>
      <Head>
        <title>Quote Generator</title>
        <meta name="description" content="A quote generator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Background */}
      <GradientBackgroundCon>
      
        {/* Quote Generator Modal Pop-up */}
        {/* <QuoteGeneratorModal
        /> */}

        {/* Quote Generator */}
        <QuoteGeneratorCon>
          <QuoteGeneratorInnerCon>
            <QuoteGeneratorTitle>
              Daily Quote Generator
            </QuoteGeneratorTitle>

            <QuoteGeneratorSubTitle>
              Looking for a nice quote? Generate a quote card with a random quote provided by <FooterLink href="https://zenquotes.io" target="_blank" rel="noopener noreferrer">ZenQuotes API</FooterLink>.
            </QuoteGeneratorSubTitle>

            <GenerateQuoteButton>
              <GenerateQuoteButtonText 
              // onClick={null}
              >
              Make a Quote
              </GenerateQuoteButtonText>
            </GenerateQuoteButton>
          </QuoteGeneratorInnerCon>
        </QuoteGeneratorCon>

      {/* Background Images */}
      <BackgroundImage1
        src={Clouds1}
        height="300"
        alt="cloudybackground1"
       />

      <BackgroundImage2
        src={Clouds2}
        height="300"
        alt="cloudybackground1"
       />

       {/* Footer */}
       <FooterCon>
        <>
          Quotes Generated: {numberOfQuotes}
          <br />
          Developed with <RedSpan>♥</RedSpan> by <FooterLink 
          href="https://www.linkedin.com/in/tmills-webdev" 
          target='_blank' rel='noopener noreferrer'>
          Tanner Mills </FooterLink>
        </>
       </FooterCon>

      </GradientBackgroundCon>
    </>
  )
}
