# base-setup-integration-test
Base setup for "Integration Tests" for frequently used scenarios

# Description
If we navigate to the test folder, 3 test specifications have been added:
- mocha-test.spec.js: with the use case of `chai`, `mocha`, and `supertest`
- nock-test.spec.js: use case of `nock`
- sinon-test.spec.js: use case of `nock`, `nock+sinon`

**Test cases path**
- {{project_root_path}}/test

**Note**
- At present, this repo is useful only for the base setup of "Integration Tests" for various possible use cases.
- The e2e execution support is not yet added but soon it will be available.