import { graphql, useStaticQuery } from "gatsby"
import React, { useState } from "react"
import * as zip from "@zip.js/zip.js"

export default function ThreeSixtyViewer() {
  const query = graphql`
    {
      file(name: { eq: "bse" }) {
        publicURL
      }
    }
  `
  const data = useStaticQuery(query)
  const [srcArr, setSrcArr] = useState([])
  const archive = new zip.ZipReader(new zip.HttpReader(data.file.publicURL))
  if (srcArr.length === 0)
    archive
      .getEntries()
      .then(res => {
        const arrayPromis = res
          .filter(item => (item.filename.includes('.jpg') && !item.filename.includes('MACOSX')) )
          .map(item => ({
            filename: item.filename.replace("jpg 1200/", ""),
            base64: item.getData(new zip.Data64URIWriter()),
          }))
          .sort((a, b) => a.filename.localeCompare(b.filename))
        return Promise.all(arrayPromis)
      })
      .then(res => setSrcArr(res))
  console.log(srcArr)
  return <div>{data.file.publicURL}</div>
}
