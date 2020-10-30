'use strict';

const Storage = require('@google-cloud/storage');
const BigQuery = require('@google-cloud/bigquery');

// Instantiates a client
const storage = Storage();
const bigquery = new BigQuery();

/**
 * Creates a BigQuery load job to load a file from Cloud Storage and write the data into BigQuery.
 *
 * @param {object} data The event payload.
 * @param {object} context The event metadata.
 */
exports.loadFile = (data, context) => {

    var filename = data.name;
    var parts = filename.split('.');
    
    if (parts[parts.length - 1] == "csv") {
        
        const datasetId = 'first_party_data';
        const tableId = 's3_load';
        
        const jobMetadata = {
            skipLeadingRows: 1,
            sourceFormat: 'CSV',
            autodetect: true,
            writeDisposition: 'WRITE_TRUNCATE',
        };

        // Loads data from a Google Cloud Storage file into the table
        bigquery
            .dataset(datasetId)
            .table(tableId)
            .load(storage.bucket(data.bucket).file(data.name), jobMetadata)
            .catch(err => {
                console.error('ERROR:', err);
            });

        console.log(`Loading from gs://${data.bucket}/${data.name} into ${datasetId}.${tableId}`);       
    }
};
