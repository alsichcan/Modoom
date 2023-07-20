import hashlib
from modoom_api.settings.base import MEDIAFILES_LOCATION
from django.conf import settings
from django.core.cache import cache
from storages.backends.s3boto3 import S3Boto3Storage


class MediaStorage(S3Boto3Storage):
    location = MEDIAFILES_LOCATION


class CachedS3Boto3Storage(S3Boto3Storage):
    """ adds caching for temporary urls """

    location = MEDIAFILES_LOCATION

    def url(self, name, parameters=None, expire=None, http_method=None):
        # Add a prefix to avoid conflicts with any other apps
        key = hashlib.md5(("CachedS3Boto3Storage_%s" % name).encode()).hexdigest()
        result = cache.get(key)
        if result:
            return result

        # No cached value exists, follow the usual logic
        result = super(CachedS3Boto3Storage, self).url(name)

        # Cache the result for 3/4 of the temp_url's lifetime.
        try:
            timeout = settings.AWS_QUERYSTRING_EXPIRE
        except:
            timeout = 3600
        timeout = int(timeout * 0.75)
        cache.set(key, result, timeout)

        return result
