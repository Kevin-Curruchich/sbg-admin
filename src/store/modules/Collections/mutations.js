export const setCollection = (state, val) => {
  state.collections = val;
};
export const setIsLoadingCollections = (state, val) => {
  state.isLoadingCollection = val;
};

export const setIsLoadingAssignedCollections = (state, val) => {
  state.isLoadingAssignedCollections = val;
};

export const setAssignedCollection = (state, val) => {
  state.assignedCollections = val;
};

export const setCollectionTypes = (state, val) => {
  state.collectionTypes = val;
};

export const setIsLoadingCollectionTypes = (state, val) => {
  state.isLoadingCollectionTypes = val;
};

export const setCollectionsOwedByStudent = (state, val) => {
  state.collectionsOwedByStudent = val;
};

export const setIsLoadingCollectionsOwedByStudent = (state, val) => {
  state.isLoadingCollectionsOwedByStudent = val;
};

export const setCollectionsByStudent = (state, val) => {
  state.collectionsByStudent = val;
};

export const setIsLoadingCollectionsByStudent = (state, val) => {
  state.isLoadingCollectionsByStudent = val;
};
