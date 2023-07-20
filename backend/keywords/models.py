from django.db import models


# -------------------- 키워드 -------------------- #
class KeywordGroup(models.Model):
    """ 키워드 그룹 """

    name = models.CharField(max_length=20, unique=True)
    n_keywords = models.PositiveIntegerField(default=0)
    n_profiles = models.PositiveIntegerField(default=0)
    n_modooms = models.PositiveIntegerField(default=0)
    custom_order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.name


class Keyword(models.Model):
    """ 키워드 """

    name = models.CharField(max_length=20, unique=True)
    n_profiles = models.PositiveIntegerField(default=0)
    n_modooms = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    keyword_group = models.ManyToManyField(
        KeywordGroup,
        related_name="keywords",
        blank=True,
    )

    def __str__(self):
        return self.name
