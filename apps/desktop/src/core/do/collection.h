#ifndef MODELS_COLLECTION_H_
#define MODELS_COLLECTION_H_

namespace data {
  class DomainObjectCollection {
  public:
    DomainObject* insert(DomainObject* obj);
    DomainObject* remove(DomainObject* obj);
    // find
  };
}

#endif